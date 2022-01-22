package net.rafael.web.control.database.local

import net.rafael.web.control.WebControl
import net.rafael.web.control.interfaces.IDatabaseAdapter
import java.io.File

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 2:14 PM
// In the project WebControl
//
//------------------------------

class LocalDatabaseAdapter : IDatabaseAdapter {

    override fun connect() {
        WebControl.logger.info("Starting Local Database...")
        if (!databaseFolder.exists()) {
            databaseFolder.mkdirs()
        }
    }

    override fun disconnect() {

    }

    companion object {
        private val databaseFolder = File("database/local/")
    }

}