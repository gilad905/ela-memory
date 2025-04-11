Push-Location .\@raw-assets\images

$input_img = "WhatsApp Image 2025-04-03 at 13.52.04.jpeg"
$output = "zoomed./12.jpeg"

$gravity = "Center"
$cropWidthPercent = 65
$cropHeightPercent = 65

$dimensions = magick identify -format "%w %h" $input_img
$parts = $dimensions -split " "
$width = [int]$parts[0]
$height = [int]$parts[1]

$cropWidth = [math]::Round($width * $cropWidthPercent / 100)
$cropHeight = [math]::Round($height * $cropHeightPercent / 100)

magick $input_img -gravity $gravity -crop "${cropWidth}x${cropHeight}+0+0" +repage $output

Write-Host "${cropWidth}x${cropHeight} $gravity - $output"

Pop-Location