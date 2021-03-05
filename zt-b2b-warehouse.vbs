
'
' 打开浏览器，模拟按键F11实现全屏
' by lcs
' 2020-12-11
'
Dim WshShell
Set WshShell = WScript.CreateObject("WScript.Shell") 
WScript.Sleep 100
WshShell.Run "CHROME.EXE"
'WshShell.Run "MSEDGE.EXE" 
WScript.Sleep 3000
'WshShell.AppActivate "about:blank-Google Chrome" 
WshShell.SendKeys "%d"
WScript.Sleep 100
WshShell.SendKeys "http://admin.223.gdztyy.com/warehouse.html?code=123456" 
WScript.Sleep 100
WshShell.SendKeys "{ENTER}" 
WshShell.SendKeys "{ENTER}" 
WScript.Sleep 3000 
WshShell.SendKeys "{F11}" 