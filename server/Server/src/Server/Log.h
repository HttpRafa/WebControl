#pragma once

#include <spdlog/spdlog.h>
#include <spdlog/fmt/ostr.h>

namespace WebControl {

	class Log {

	private:
		static std::shared_ptr<spdlog::logger> s_logger;

	public:
		static void init();

		inline static std::shared_ptr<spdlog::logger>& getLogger() {
			return s_logger;
		}

	};

}

#define WC_TRACE(...) WebControl::Log::getLogger()->trace(__VA_ARGS__)
#define WC_INFO(...) WebControl::Log::getLogger()->info(__VA_ARGS__)
#define WC_WARN(...) WebControl::Log::getLogger()->warn(__VA_ARGS__)
#define WC_ERROR(...) WebControl::Log::getLogger()->error(__VA_ARGS__)
#define WC_CRITICAL(...) WebControl::Log::getLogger()->critical(__VA_ARGS__)