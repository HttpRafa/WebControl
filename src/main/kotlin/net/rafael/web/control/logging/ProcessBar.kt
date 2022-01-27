package net.rafael.web.control.logging

import java.lang.StringBuilder

//------------------------------
//
// This class was developed by Rafael K.
// On 22.06.2020 at 14:46
// In the project WebControl
//
//------------------------------

class ProcessBar(logger: ApplicationLogger, downloadSpeed: Int, end: Long, state: Long) {

    init {
        val portent = state * 100 / end
        val result = StringBuilder()
        var i = 0
        while (i < 100) {
            if (i < portent) {
                if (portent >= 100) {
                    result.append("§a»")
                } else {
                    result.append("§e»")
                }
            } else {
                result.append("§7«")
            }
            i += 3
        }
        if (portent > 100) {
            logger.overrideLine(
                1,
                "100 % §7" + result.toString() + " §e" + state / 1000 + "KB §8/ §7" + state / 1000 + "KB §8| §e" + downloadSpeed + "KB/s"
            )
        } else {
            val s1 = if (portent > 9) portent.toString() + "" else "$portent "
            if (portent == 100L) {
                logger.overrideLine(
                    1,
                    s1 + " % §7" + result.toString() + " §e" + state / 1000 + "KB §8/ §7" + state / 1000 + "KB §8| §e" + downloadSpeed + "KB/s"
                )
            } else logger.overrideLine(
                1,
                s1 + " % §7" + result.toString() + " §e" + state / 1000 + "KB §8/ §7" + end / 1000 + "KB §8| §e" + downloadSpeed + "KB/s"
            )
        }
    }
}