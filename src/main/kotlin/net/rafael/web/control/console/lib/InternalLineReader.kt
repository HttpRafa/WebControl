package net.rafael.web.control.console.lib

import org.jline.reader.impl.LineReaderImpl
import org.jline.terminal.Terminal

//------------------------------
//
// This class was developed by Rafael K.
// On 1/28/2022 at 3:26 PM
// In the project WebControl
//
//------------------------------

class InternalLineReader internal constructor(terminal: Terminal, appName: String, variables: Map<String, Any>) : LineReaderImpl(terminal, appName, variables) {

}