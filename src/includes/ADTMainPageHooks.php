<?php

class ADTMainPageHooks {
    public static function onBeforePageDisplay( OutputPage $out, Skin $skin ) {
        if ( $out->getTitle()->isMainPage() ) {
            $out->addModules( [
                'ext.adt.mainpage'
            ] );
        }
    }
}