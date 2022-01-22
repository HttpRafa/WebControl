package net.rafael.web.control.database

import net.rafael.web.control.WebControl
import net.rafael.web.control.database.local.LocalDatabaseAdapter
import net.rafael.web.control.database.mongodb.MongoDBDatabaseAdapter
import net.rafael.web.control.interfaces.IDatabase
import net.rafael.web.control.interfaces.IDatabaseAdapter
import java.util.*

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 2:16 PM
// In the project WebControl
//
//------------------------------

class DatabaseManager(val databaseType: DatabaseType) {

    lateinit var databaseAdapter: IDatabaseAdapter

    init {
        WebControl.logger.info("Initializing database type[" + databaseType.name + "]...")
        if(databaseType == DatabaseType.LOCAL) {
            databaseAdapter = LocalDatabaseAdapter()
        } else if(databaseType == DatabaseType.MONGODB) {
            databaseAdapter = MongoDBDatabaseAdapter()
        }
    }

    fun connect() {
        databaseAdapter.connect()
    }

    fun disconnect() {
        databaseAdapter.disconnect()
    }

}