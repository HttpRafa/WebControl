package net.rafael.web.control.network.packet

import net.rafael.web.control.network.document.Document
import java.util.UUID

//------------------------------
//
// This class was developed by Rafael K.
// On 1/31/2022 at 10:30 AM
// In the project WebControl
//
//------------------------------

open class Packet(val id: Int, val document: Document) {

    val uuid: String = UUID.randomUUID().toString()

}