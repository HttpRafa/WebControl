package net.rafael.web.control.interfaces

import java.util.Optional
import net.rafael.web.control.interfaces.IDatabase

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 3:04 PM
// In the project WebControl
//
//------------------------------
interface IDatabaseAdapter {

    fun connect()
    fun disconnect()

    fun getDatabase(name: String): Optional<IDatabase>
    fun createDatabase(name: String): Optional<IDatabase>
    fun createDatabaseIfNotExists(name: String): Optional<IDatabase>
    fun deleteDatabase(name: String)

}