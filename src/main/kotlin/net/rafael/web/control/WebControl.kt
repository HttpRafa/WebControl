package net.rafael.web.control

import net.rafael.web.control.config.ConfigManager
import net.rafael.web.control.database.DatabaseManager
import net.rafael.web.control.database.DatabaseType
import net.rafael.web.control.logging.ApplicationLogger
import java.io.File

//------------------------------
//
// This class was developed by Rafael K.
// On 1/20/2022 at 1:29 PM
// In the project WebControl
//
//------------------------------

class WebControl(args: Array<String>) {

    private val configManager: ConfigManager
    private val databaseManager: DatabaseManager

    init {
        webControl = this
        logger = ApplicationLogger()

        configManager = ConfigManager(File("configs/"), File("configs/config.json"))

        databaseManager = DatabaseManager(DatabaseType.valueOf(configManager.jsonObject.get("database").asJsonObject.get("type").asString))
        databaseManager.connect()
        databaseManager.createDatabases()
    }

    companion object {
        lateinit var webControl: WebControl private set
        lateinit var logger: ApplicationLogger private set
    }

}