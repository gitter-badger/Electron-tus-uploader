set PLATFORM=%1%
set ARCH=%2%
set APP_NAME="uploader"

set ignore_list="dist|scripts|\.idea|.*\.md|.*\.yml|node_modules"

electron-packager . "%APP_NAME%" --platform=%PLATFORM% --arch=%ARCH% --electronVersion=2.0.2  --app-version=0.1.0 --asar --overwrite --out=.\dist --ignore=%ignore_list%
