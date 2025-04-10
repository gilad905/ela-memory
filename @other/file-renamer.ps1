# Rename-Item -Path
# "C:\Users\gilad\Documents\Programming\Game dev\ela-memory\@raw-assets\images\WhatsApp Image 2025-04-10 at 14.19.26 (1).jpeg
# -NewName
# .\@raw-assets\images\040.jpeg

$folderPath = ".\@raw-assets\images"
$files = Get-ChildItem -Path $folderPath -File

$counter = 21
foreach ($file in $files) {
    $newName = "{0:D2}{1}" -f $counter, $file.Extension
    Rename-Item -Path "$($file.FullName)" -NewName "$newName"
    $counter++
}
