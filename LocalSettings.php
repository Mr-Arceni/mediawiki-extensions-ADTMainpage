<?php
if ( !defined( 'MEDIAWIKI' ) ) {
	exit;
}

$wgSitename = "ADTwiki";
$wgScriptPath = "";
$wgServer = "http://localhost:8080";
$wgResourceBasePath = $wgScriptPath;
$wgLogos = [
	'1x' => "$wgResourceBasePath/resources/assets/change-your-logo.svg",
	'icon' => "$wgResourceBasePath/resources/assets/change-your-logo.svg",
];
$wgEnableEmail = false;
$wgEnableUserEmail = true;

$wgEmergencyContact = "";
$wgPasswordSender = "";

$wgEnotifUserTalk = false;
$wgEnotifWatchlist = false;
$wgEmailAuthentication = true;

$wgDBtype = "mysql";
$wgDBserver = "database";
$wgDBname = "test_wiki";
$wgDBuser = "root";
$wgDBpassword = "1111";

$wgDBprefix = "";
$wgDBssl = false;

$wgDBTableOptions = "ENGINE=InnoDB, DEFAULT CHARSET=binary";

$wgSharedTables[] = "actor";

$wgMainCacheType = CACHE_ACCEL;
$wgMemCachedServers = [];

$wgEnableUploads = true;
$wgUseImageMagick = true;
$wgImageMagickConvertCommand = "/usr/bin/convert";

$wgUseInstantCommons = false;

$wgPingback = false;

$wgLanguageCode = "ru";

# Time zone
$wgLocaltimezone = "UTC";

$wgSecretKey = "8faf4b402eba12c82b407faadf2efb37da063e342fc0e5b50780249f2ce09a77";

$wgAuthenticationTokenVersion = "1";

$wgUpgradeKey = "20c81e244e8720df";

$wgRightsPage = ""; # Set to the title of a wiki page that describes your license/copyright
$wgRightsUrl = "https://creativecommons.org/licenses/by-sa/4.0/";
$wgRightsText = "Creative Commons Attribution-ShareAlike";
$wgRightsIcon = "$wgResourceBasePath/resources/assets/licenses/cc-by-sa.png";

$wgDiff3 = "/usr/bin/diff3";

$wgDefaultSkin = "citizen";
wfLoadSkin( 'Citizen' );

wfLoadExtension( 'ADTMainpage' );

wfLoadExtension( 'CodeEditor' );
wfLoadExtension( 'Linter' );
wfLoadExtension( 'Math' );
wfLoadExtension( 'ParserFunctions' );
wfLoadExtension( 'Scribunto' );
wfLoadExtension( 'SyntaxHighlight_GeSHi' );
wfLoadExtension( 'TemplateData' );
wfLoadExtension( 'TemplateStyles' );
wfLoadExtension( 'VisualEditor' );
wfLoadExtension( 'WikiEditor' );

$wgShowExceptionDetails = true;
$wgShowDBErrorBacktrace = true;
$wgDebugLogFile = "/var/www/html/debug.log";