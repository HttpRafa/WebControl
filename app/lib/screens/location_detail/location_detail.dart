import 'package:flutter/material.dart';
import 'package:webcontrol/screens/location_detail/image_banner.dart';
import 'package:webcontrol/screens/location_detail/text_section.dart';

class LocationDetail extends StatelessWidget {

  const LocationDetail({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Test App"),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: const [
          ImageBanner("assets/images/1f595.png"),
          TextSection("summary", "Months on ye at by esteem desire warmth former. Sure that that way gave any fond now. His boy middleton sir nor engrossed affection excellent."),
          TextSection("summary", "Up am intention on dependent questions oh elsewhere september. No betrayed pleasure possible jointure we in throwing. And can event rapid any shall woman green."),
          TextSection("summary", "Consulted perpetual of pronounce me delivered. Too months nay end change relied who beauty wishes matter. Shew of john real park so rest we on."),
        ]
      ),
    );
  }

}