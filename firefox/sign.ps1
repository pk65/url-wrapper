. ~/.config/firefox_cred.ps1
$api_proxy=""
if ($env:http_proxy) { 
  $api_proxy="--api-proxy=" + $env:http_proxy
}
& web-ext sign --api-key=$env:AMO_JWT_ISSUER --api-secret=$env:AMO_JWT_SECRET --api-proxy=$env:http_proxy
