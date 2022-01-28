package net.rafael.web.control.console.lib

import net.rafael.web.control.console.lib.InternalLineReaderBuilder
import net.rafael.web.control.console.lib.InternalLineReader
import org.jline.reader.Completer
import org.jline.reader.LineReader
import org.jline.terminal.Terminal
import java.util.*

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:24 PM
// In the project WebControl
//
//------------------------------

class InternalLineReaderBuilder(private val terminal: Terminal) {

    private val variables: MutableMap<String, Any> = HashMap()
    private val options: MutableMap<LineReader.Option, Boolean> = EnumMap(LineReader.Option::class.java)

    private var completer: Completer? = null

    fun variable(name: String, value: Any): InternalLineReaderBuilder {
        variables[name] = value
        return this
    }

    fun option(option: LineReader.Option, value: Boolean): InternalLineReaderBuilder {
        options[option] = value
        return this
    }

    fun completer(completer: Completer): InternalLineReaderBuilder {
        this.completer = completer
        return this
    }

    fun build(): InternalLineReader {
        val reader = InternalLineReader(terminal, "WebControl-Console", variables)
        if (completer != null) {
            reader.completer = completer
        }
        for ((key, value) in options) {
            reader.option(key, value)
        }
        return reader
    }

}