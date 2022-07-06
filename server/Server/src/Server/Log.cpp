#include "pch.h"
#include "Log.h"

#include <spdlog/sinks/stdout_color_sinks.h>

namespace WebControl {

	std::shared_ptr<spdlog::logger> Log::s_logger;

	void Log::init() {

		spdlog::set_pattern("%^[%T/%l] %n: %v%$");

		s_logger = spdlog::stdout_color_mt("Server");
		s_logger->set_level(spdlog::level::trace);

		s_logger->info("Loggingservice initialized");

	}

}