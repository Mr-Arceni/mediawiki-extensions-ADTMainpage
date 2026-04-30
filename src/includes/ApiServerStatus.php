<?php
namespace MediaWiki\Extension\ADTMainpage;

use ApiBase;
use MediaWiki\Http\HttpRequestFactory;
use MediaWiki\Logger\LoggerFactory;
use Wikimedia\ObjectCache\WANObjectCache;

class ApiServerStatus extends ApiBase {
    private $httpRequestFactory;
    private WANObjectCache $cache;
    private const ADDRESS = '193.164.18.155:1212';

    public function __construct( $query, $moduleName, HttpRequestFactory $httpRequestFactory, WANObjectCache $cache ) {
        parent::__construct( $query, $moduleName );
        $this->httpRequestFactory = $httpRequestFactory;
        $this->cache = $cache;
    }

public function execute() {
        $cacheKey = $this->cache->makeKey( 'ext', 'adtmainpage', 'serverstatus' );

        $data = $this->cache->getWithSetCallback(
            $cacheKey,
            2,
            function ( $oldValue, &$ttl, array &$setOpts ) {
                $url = 'http://'.self::ADDRESS.'/status';
                $logger = LoggerFactory::getInstance( 'ADTMainpage' );

                $request = $this->httpRequestFactory->create( $url, [ 'method' => 'GET', 'timeout' => 2 ], __METHOD__ );
                $status = $request->execute();

                if ( $status->isOK() ) {
                    $content = $request->getContent();
                    $decoded = json_decode( $content, true );
                    if ( json_last_error() === JSON_ERROR_NONE ) {
                        return $decoded;
                    } else {
                        $logger->error( "Failed to decode JSON from {url}: {error}. Content: {content}", [
                            'url' => $url,
                            'error' => json_last_error_msg(),
                            'content' => substr( $content, 0, 500 )
                        ] );
                        return [ 'offline' => true, 'error' => 'json_decode_error' ];
                    }
                }

                $logger->error( "Failed to fetch server status from {url}. Status: {status}", [
                    'url' => $url,
                    'status' => $status->getMessage()
                ] );

                return [ 'offline' => true, 'error' => 'http_request_error', 'message' => $status->getMessage() ];
            }
        );

        $this->getResult()->addValue( null, $this->getModuleName(), $data );
    }

    public function isReadMode() {
        return true;
    }
}