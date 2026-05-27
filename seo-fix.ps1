
# SEO Fix Script - Fix OG URLs, add canonical links, and add AdSense to calculator HTML files
$calcDir = "c:\Users\Admin\Desktop\my tools\replit\EngineeringCalculator\public\calculators"
$adsenseScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8732458645979427" crossorigin="anonymous"></script>'

$files = Get-ChildItem -Path $calcDir -Filter "*.html"

foreach ($file in $files) {
    $filename = $file.Name
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # 1. Fix og:url - replace wrong domain
    $content = $content -replace 'https://engineering-calculators\.replit\.app/calculators/', 'https://engineering.calculatorfree.in/calculators/'
    
    # 2. Add canonical tag after viewport meta (if not already present)
    $canonicalUrl = "https://engineering.calculatorfree.in/calculators/$filename"
    $canonicalTag = "<link rel=`"canonical`" href=`"$canonicalUrl`" />"
    
    if ($content -notmatch 'rel="canonical"') {
        # Insert after viewport meta tag
        $content = $content -replace '(<meta name="viewport"[^>]*>)', "`$1`r`n    $canonicalTag"
    }
    
    # 3. Add AdSense script if not already present
    if ($content -notmatch 'pagead2\.googlesyndication\.com') {
        # Insert before closing </head>
        $content = $content -replace '</head>', "    $adsenseScript`r`n</head>"
    }
    
    # Write back
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Processed: $filename"
}

Write-Host "`nAll $($files.Count) files processed successfully!"
