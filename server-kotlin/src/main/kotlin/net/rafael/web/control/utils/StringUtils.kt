package net.rafael.web.control.utils

import java.lang.StringBuilder

//------------------------------
//
// This class was developed by Rafael K.
// On 1/29/2022 at 12:35 PM
// In the project WebControl
//
//------------------------------

object StringUtils {

    fun stringListToString(list: List<String>, splitElement: String): String {
        val stringBuilder = StringBuilder()
        for (i in list.indices) {
            if (i < list.size - 1) {
                stringBuilder.append(list[i]).append(splitElement)
            } else {
                stringBuilder.append(list[i])
            }
        }
        return stringBuilder.toString()
    }

    fun arrayToString(list: Array<String>, splitElement: String): String {
        val stringBuilder = StringBuilder()
        for (i in list.indices) {
            if (i < list.size - 1) {
                stringBuilder.append(list[i]).append(splitElement)
            } else {
                stringBuilder.append(list[i])
            }
        }
        return stringBuilder.toString()
    }

}