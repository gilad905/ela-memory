Push-Location .\@raw-assets\images

$number = "34"
$gravity = "Center"
$percent = 65

$input_img = "$number.jpeg"
$output = "../zoomed/$number.jpeg"
$dimensions = magick identify -format "%w %h" $input_img
$parts = $dimensions -split " "
$width = [int]$parts[0]
$height = [int]$parts[1]
$cropWidth = [math]::Round($width * $percent / 100)
$cropHeight = [math]::Round($height * $percent / 100)

magick $input_img -gravity $gravity -crop "${cropWidth}x${cropHeight}+0+0" +repage $output

Write-Host "${cropWidth}x${cropHeight} $gravity - $output"

Pop-Location