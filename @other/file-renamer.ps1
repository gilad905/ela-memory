$folderPath = ".\@raw-assets\images"
$files = Get-ChildItem -Path $folderPath -File

$counter = 1
foreach ($file in $files) {
    $newName = $counter.ToString() + $file.Extension
    # $newName = "{0:D2}{1}" -f $counter, $file.Extension
    Rename-Item -Path "$($file.FullName)" -NewName "$newName"
    $counter++
}
