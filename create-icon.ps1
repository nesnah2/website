# Create 192x192 icon
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(192, 192)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(26, 26, 26))

# Draw border
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(68, 204, 68), 10)
$g.DrawRectangle($pen, 10, 10, 172, 172)

# Draw text
$font = New-Object System.Drawing.Font('Arial', 48, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(68, 204, 68))
$g.DrawString('DM', $font, $brush, 50, 60)

$font2 = New-Object System.Drawing.Font('Arial', 12, [System.Drawing.FontStyle]::Bold)
$brush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 107, 53))
$g.DrawString('WORKBOOK', $font2, $brush2, 60, 120)

# Save
$bmp.Save('assets/icon-192.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

# Create 512x512 icon
$bmp2 = New-Object System.Drawing.Bitmap(512, 512)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.Clear([System.Drawing.Color]::FromArgb(26, 26, 26))

# Draw border
$pen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(68, 204, 68), 25)
$g2.DrawRectangle($pen2, 25, 25, 462, 462)

# Draw text
$font3 = New-Object System.Drawing.Font('Arial', 128, [System.Drawing.FontStyle]::Bold)
$brush3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(68, 204, 68))
$g2.DrawString('DM', $font3, $brush3, 130, 160)

$font4 = New-Object System.Drawing.Font('Arial', 32, [System.Drawing.FontStyle]::Bold)
$brush4 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 107, 53))
$g2.DrawString('WORKBOOK', $font4, $brush4, 160, 320)

# Save
$bmp2.Save('assets/icon-512.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$bmp2.Dispose()

Write-Host "Icons created successfully!"
