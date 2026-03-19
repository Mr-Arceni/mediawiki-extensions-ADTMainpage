<?php
namespace MediaWiki\Extension\ADTMainpage;

use ApiBase;
use MediaWiki\Http\HttpRequestFactory;
use MediaWiki\Cache\WANObjectCache;

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

                $request = $this->httpRequestFactory->create( $url, [ 'method' => 'GET', 'timeout' => 2 ], __METHOD__ );
                $status = $request->execute();

                if ( $status->isOK() ) {
                    $decoded = json_decode( $request->getContent(), true );
                    if ( $decoded ) {
                        return $decoded;
                    }
                }

                return [ 'offline' => true ];
            }
        );

        $this->getResult()->addValue( null, $this->getModuleName(), $data );
    }

    public function isReadMode() {
        return true;
    }
}