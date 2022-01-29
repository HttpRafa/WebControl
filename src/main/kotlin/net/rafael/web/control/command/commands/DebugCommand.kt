package net.rafael.web.control.command.commands

import net.rafael.web.control.WebControl
import net.rafael.web.control.command.AbstractCommand
import net.rafael.web.control.console.animation.progressbar.ProgressBarInputStream
import java.io.BufferedInputStream
import java.io.FileOutputStream
import java.io.IOException
import java.net.URL

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:08 PM
// In the project WebControl
//
//------------------------------

class DebugCommand(name: String) : AbstractCommand(name) {

    override fun execute(args: Array<String>) {

        try {
            BufferedInputStream(ProgressBarInputStream.wrapDownload(WebControl.logger.getConsole(), URL("http://127.0.0.1/test/test.json"))).use { input ->
                FileOutputStream("test.json").use { fileOutputStream ->
                    val dataBuffer = ByteArray(1024)
                    var bytesRead: Int
                    while (input.read(dataBuffer, 0, 1024).also { bytesRead = it } != -1) {
                        fileOutputStream.write(dataBuffer, 0, bytesRead)
                    }
                }
            }
        } catch (e: IOException) {
            // handle exception
        }

    }

}