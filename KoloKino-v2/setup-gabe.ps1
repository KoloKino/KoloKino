# ============================================================
#  Set up the Gabe subroute inside KoloKino so the borrador
#  is reachable at https://kolo-kino.com/Gabe/
#
#  This script is idempotent. Safe to run multiple times.
#
#  Steps:
#    1. Rename '02-borrador-rediseno' to 'Gabe' if needed.
#    2. Patch Gabe/index.html so audio, video and the resume
#       PDF point at the live URLs on feralhogcontent.com
#       (keeps your KoloKino git repo small).
#    3. Remove the now-unused heavy asset folders inside
#       Gabe/assets (audio, videos, documents).
#    4. Print the next git steps.
# ============================================================

$ErrorActionPreference = 'Stop'

$root      = $PSScriptRoot
$oldFolder = Join-Path $root '02-borrador-rediseno'
$newFolder = Join-Path $root 'Gabe'

Write-Host ''
Write-Host '=== Setup Gabe @ kolo-kino.com/Gabe ===' -ForegroundColor Cyan
Write-Host ''

# --- 1. Rename folder ---------------------------------------
if ((Test-Path $oldFolder) -and (Test-Path $newFolder)) {
    Write-Host '[ERROR] Both 02-borrador-rediseno and Gabe exist.' -ForegroundColor Red
    Write-Host '        Move contents manually or delete one of them, then re-run.' -ForegroundColor Yellow
    exit 1
}

if (Test-Path $oldFolder) {
    Rename-Item -Path $oldFolder -NewName 'Gabe'
    Write-Host '[1/4] Renamed: 02-borrador-rediseno -> Gabe' -ForegroundColor Green
} elseif (Test-Path $newFolder) {
    Write-Host '[1/4] Folder already named Gabe. Skipping rename.' -ForegroundColor DarkGray
} else {
    Write-Host '[ERROR] Neither 02-borrador-rediseno nor Gabe folder exists.' -ForegroundColor Red
    Write-Host '        Make sure you copied 02-borrador-rediseno into KoloKino first.' -ForegroundColor Yellow
    exit 1
}

# --- 2. Patch index.html ------------------------------------
$indexPath = Join-Path $newFolder 'index.html'
if (-not (Test-Path $indexPath)) {
    Write-Host "[ERROR] Not found: $indexPath" -ForegroundColor Red
    exit 1
}

$html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)

# Audio. Keep on Weebly (saves repo bandwidth)
$audioMap = @{
    './assets/audio/thetunnel.mp3'       = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/acx_retail_thetunnel.mp3';
    './assets/audio/skullface.mp3'       = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/retail1skull.mp3';
    './assets/audio/dreamsend.mp3'       = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/dreams_retail.mp3';
    './assets/audio/visabilityzero.mp3'  = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/visabilityretail.mp3';
    './assets/audio/bulldog.mp3'         = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/bulldog_retail.mp3';
    './assets/audio/plagiarist.mp3'      = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/theplagiarist_retail.mp3';
    './assets/audio/fireretribution.mp3' = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/fireretailsample.mp3';
    './assets/audio/heartofdarkness.mp3' = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/hdnewretailcut.mp3';
    './assets/audio/gildedtime.mp3'      = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/retailsamplegilded.mp3';
    './assets/audio/hellbilly.mp3'       = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/15hellbilly.mp3';
}
$videoMap = @{
    './assets/videos/reel-monologos-gabriel-perez.mp4' = 'https://www.weebly.com/uploads/b/72245763-246427869213786674/1monologues_gabrieljperez_814.mp4';
    './assets/videos/reel-2025-gabriel-perez.mp4'      = 'https://www.weebly.com/uploads/b/72245763-246427869213786674/2025_gabrieljperez_698.mp4';
}
$pdfKey = './assets/documents/gabriel-perez-resume.pdf'
$pdfUrl = 'https://www.feralhogcontent.com/uploads/7/2/2/4/72245763/1gabefullresume1242026.pdf'

$audioRemapped = 0; $videoRemapped = 0; $pdfRemapped = 0
foreach ($k in $audioMap.Keys) {
    if ($html.Contains($k)) { $html = $html.Replace($k, $audioMap[$k]); $audioRemapped++ }
}
foreach ($k in $videoMap.Keys) {
    if ($html.Contains($k)) { $html = $html.Replace($k, $videoMap[$k]); $videoRemapped++ }
}
if ($html.Contains($pdfKey)) { $html = $html.Replace($pdfKey, $pdfUrl); $pdfRemapped = 1 }

# Write back without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($indexPath, $html, $utf8NoBom)

Write-Host "[2/4] Patched index.html. Audio=$audioRemapped, Video=$videoRemapped, PDF=$pdfRemapped" -ForegroundColor Green

# --- 3. Remove heavy asset folders --------------------------
$heavyFolders = @('assets\audio', 'assets\videos', 'assets\documents')
$removed = 0
foreach ($sub in $heavyFolders) {
    $path = Join-Path $newFolder $sub
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force
        $removed++
    }
}
Write-Host "[3/4] Removed $removed heavy asset folders (audio, videos, documents)" -ForegroundColor Green

# --- 4. Print next git steps --------------------------------
Write-Host ''
Write-Host '=== Done ===' -ForegroundColor Cyan
Write-Host ''
Write-Host '  The Gabe folder is ready. To publish it on kolo-kino.com:' -ForegroundColor White
Write-Host ''
Write-Host '    cd "' -NoNewline; Write-Host $root -NoNewline -ForegroundColor Yellow; Write-Host '"'
Write-Host '    git add Gabe' -ForegroundColor Yellow
Write-Host '    git commit -m "Add Gabe (Feral Hog Content draft) at /Gabe"' -ForegroundColor Yellow
Write-Host '    git push' -ForegroundColor Yellow
Write-Host ''
Write-Host '  GitHub Pages will publish it automatically in 1-2 minutes at:' -ForegroundColor White
Write-Host '    https://kolo-kino.com/Gabe/' -ForegroundColor Cyan
Write-Host ''
Write-Host '  When Gabe finishes the review, remove it with:' -ForegroundColor White
Write-Host '    git rm -rf Gabe' -ForegroundColor Yellow
Write-Host '    git commit -m "Remove Gabe draft"' -ForegroundColor Yellow
Write-Host '    git push' -ForegroundColor Yellow
Write-Host ''
