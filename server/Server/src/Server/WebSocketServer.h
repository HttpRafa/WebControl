#pragma once

namespace WebControl {

	class WebSocketServer
	{

	public:
		WebSocketServer(unsigned int port = 3388);

		bool start();

	private:
		void on_message();

	private:
		unsigned int port;

	};

}

