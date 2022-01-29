package net.rafael.web.control.console.animation.progressbar

import net.rafael.web.control.console.animation.AbstractConsoleAnimation
import net.rafael.web.control.utils.StringUtils

//------------------------------
//
// This class was developed by Rafael K.
// On 1/29/2022 at 10:58 AM
// In the project WebControl
//
//------------------------------

open class ConsoleProgressBarAnimation(var length: Long, startValue: Int, progressChar: Char, lastProgressChar: Char, emptyChar: Char, prefix: String, suffix: String) : AbstractConsoleAnimation() {

    private val progressChar: Char
    private val emptyChar: Char
    private val lastProgressChar: Char
    private val prefix: String
    private val suffix: String
    var currentValue: Long

    init {
        currentValue = startValue.toLong()
        this.progressChar = progressChar
        this.lastProgressChar = lastProgressChar
        this.emptyChar = emptyChar
        this.prefix = prefix
        this.suffix = suffix
        super.updateInterval = 10
    }

    fun setLength(length: Int) {
        this.length = length.toLong()
    }

    fun finish() {
        currentValue = length
    }

    override fun handleTick(): Boolean {
        if (currentValue < length) {
            doUpdate(currentValue.toDouble() / length.toDouble() * 100.0)
            return false
        }
        doUpdate(100.0)
        return true
    }

    private fun formatCurrentValue(currentValue: Long): String {
        return formatValue(currentValue)
    }

    protected fun formatLength(length: Long): String {
        return formatValue(length)
    }

    protected open fun formatValue(value: Long): String {
        return value.toString()
    }

    private fun formatTime(millis: Long): String {
        val seconds = millis / 1000
        var min = (seconds / 60).toString()
        var sec = (seconds - seconds / 60 * 60).toString()
        if (min.length == 1) {
            min = "0$min"
        }
        if (sec.length == 1) {
            sec = "0$sec"
        }
        return "$min:$sec"
    }

    private fun doUpdate(percent: Double) {
        val roundPercent = percent.toInt()
        val chars = Array(100) { "" }
        for (i in 0 until roundPercent) {
            chars[i] = "§3$progressChar"
        }

        for (i in roundPercent..99) {
            chars[i] = "§7$emptyChar"
        }
        chars[0.coerceAtLeast(roundPercent - 1)] = "$lastProgressChar"

        super.print(this.format(prefix, percent), StringUtils.arrayToString(chars, ""), this.format(suffix, percent))
    }

    protected fun format(input: String, percent: Double): String {
        val millis = System.currentTimeMillis() - startTime
        val time = millis / 1000
        return input.replace("%value%", formatCurrentValue(currentValue)).replace("%length%", formatLength(length)).replace("%percent%", String.format("%.2f", percent)).replace("%time%", formatTime(millis)).replace("%bips%", if (time == 0L) "0" else (currentValue / 1024 * 8 / time).toString()).replace("%byps%", if (time == 0L) "0" else (currentValue / 1024 / time).toString())
    }

}