package net.rafael.web.control.console.animation.progressbar

import net.rafael.web.control.console.interfaces.IApplicationConsole
import kotlin.Throws
import java.io.IOException
import java.io.InputStream
import java.net.URL

//------------------------------
//
// This class was developed by Rafael K.
// On 1/29/2022 at 11:01 AM
// In the project WebControl
//
//------------------------------

class ProgressBarInputStream(private val progressBarAnimation: ConsoleProgressBarAnimation, val wrapped: InputStream) : InputStream() {

    constructor(console: IApplicationConsole, wrapped: InputStream, length: Long) : this(ConsoleDownloadProgressBarAnimation(length, 0, '»', '»', '«', "§b%percent% % §7", " §b%value%§8/§7%length% §7MB §8(§b%byps% §7KB§8/§7s§8) | §b%time%"), wrapped) {
        console.startAnimation(progressBarAnimation)
    }

    @Throws(IOException::class)
    override fun read(): Int {
        val read = wrapped.read()
        progressBarAnimation.currentValue = progressBarAnimation.currentValue + 1
        return read
    }

    @Throws(IOException::class)
    override fun read(b: ByteArray): Int {
        val read = wrapped.read(b)
        progressBarAnimation.currentValue = progressBarAnimation.currentValue + read
        return read
    }

    @Throws(IOException::class)
    override fun read(b: ByteArray, off: Int, len: Int): Int {
        val read = wrapped.read(b, off, len)
        progressBarAnimation.currentValue = progressBarAnimation.currentValue + read
        return read
    }

    @Throws(IOException::class)
    override fun skip(n: Long): Long {
        val length = wrapped.skip(n)
        progressBarAnimation.currentValue = progressBarAnimation.currentValue + length
        return length
    }

    @Throws(IOException::class)
    override fun close() {
        progressBarAnimation.finish()
        wrapped.close()
    }

    companion object {

        @Throws(IOException::class)
        fun wrapDownload(console: IApplicationConsole, url: URL): InputStream {

            val urlConnection = url.openConnection()
            urlConnection.setRequestProperty(
                "User-Agent",
                "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11"
            )
            urlConnection.connect()
            val inputStream = urlConnection.getInputStream()
            val contentLength = urlConnection.getHeaderFieldLong("Content-Length", inputStream.available().toLong())
            return if (console.isPlayingAnimation()) inputStream else ProgressBarInputStream(console, inputStream, contentLength)

        }

    }

}