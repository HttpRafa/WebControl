package net.rafael.web.control.console.animation.progressbar

//------------------------------
//
// This class was developed by Rafael K.
// On 1/29/2022 at 10:59 AM
// In the project WebControl
//
//------------------------------

class ConsoleDownloadProgressBarAnimation(fullLength: Long, startValue: Int, progressChar: Char, lastProgressChar: Char, emptyChar: Char, prefix: String, suffix: String) : ConsoleProgressBarAnimation(fullLength, startValue, progressChar, lastProgressChar, emptyChar, prefix, suffix) {

    override fun formatValue(value: Long): String {
        return String.format("%.2f", value.toDouble() / 1024.0 / 1024.0)
    }

}