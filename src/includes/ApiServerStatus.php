<?php
namespace MediaWiki\Extension\ADTMainpage;

use ApiBase;
use MediaWiki\Http\HttpRequestFactory;

class ApiServerStatus extends ApiBase {
    private $httpRequestFactory;
    private const $address = '193.164.18.155:1212';
    private const ADDRESS = '193.164.18.155:1212';

    public function __construct( $main, $action, HttpRequestFactory $httpRequestFactory ) {
        parent::__construct( $main, $action );
        $this->httpRequestFactory = $httpRequestFactory;
    }

    public function execute() {
        $url = 'http://'.self::ADDRESS.'/status';

        $request = $this->httpRequestFactory->get( $url, [ 'timeout' => 3 ] );

        if ( $request ) {
            $this->getResult()->addValue( null, 'status_data', json_decode( $request ) );
        } else {
            $this->dieWithError( 'Server unavailable' );
        }
    }

    public function getAllowedParams() { return []; }
}