package net.rafael.web.control.network.packet.output

import net.rafael.web.control.network.document.Document
import net.rafael.web.control.network.packet.Packet
import net.rafael.web.control.user.User

//------------------------------
//
// This class was developed by Rafael K.
// On 2/7/2022 at 8:42 PM
// In the project WebControl
//
//------------------------------

class PacketOutRequestUserData(user: User) : Packet(4, Document().append("applicationIndex", -1)) {}