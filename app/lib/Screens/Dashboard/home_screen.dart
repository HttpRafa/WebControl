import 'package:flutter/material.dart';
import 'package:webcontrol/constants.dart';
import 'package:webcontrol/widgets/applications_dropdown.dart';
import 'package:webcontrol/widgets/custom_app_bar.dart';

class HomeScreen extends StatefulWidget {

  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _HomeScreenState();
  }

}

class _HomeScreenState extends State<HomeScreen> {

  String _application = "Example 1";

  @override
  Widget build(BuildContext context) {

    final size = MediaQuery.of(context).size;

    return Scaffold(
      appBar: CustomAppBar(),
      body: CustomScrollView(
        physics: ClampingScrollPhysics(),
        slivers: [
          _buildHeader(size.height),
          _buildApplicationStatus(size.height),
        ],
      ),
    );
  }

  SliverToBoxAdapter _buildHeader(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: kPrimaryColor,
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(40),
            bottomRight: Radius.circular(40),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "WebControl",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 25,
                    fontWeight: FontWeight.bold
                  ),
                ),
                ApplicationsDropdown(
                  applications: ["Example 1", "Example 2"],
                  application: _application,
                  onChanged: (value) {
                    setState(() {
                      _application = value!;
                    });
                  },
                ),
              ],
            ),
            SizedBox(height: screenHeight * 0.03),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Application Status",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                SizedBox(height: screenHeight * 0.01),
                const Text(
                  "Here you can find all informations about your Application",
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 15,
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    FlatButton.icon(
                      padding: const EdgeInsets.symmetric(
                          vertical: 20,
                          horizontal: 20
                      ),
                      onPressed: () {},
                      icon: const Icon(
                        Icons.api,
                        color: Colors.white,
                      ),
                      label: const Text(
                        "Start",
                        style: kButtonTextStyle,
                      ),
                      textColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30)
                      ),
                      color: Colors.green,
                    ),
                    FlatButton.icon(
                      padding: const EdgeInsets.symmetric(
                          vertical: 20,
                          horizontal: 20
                      ),
                      onPressed: () {},
                      icon: const Icon(
                        Icons.api,
                        color: Colors.white,
                      ),
                      label: const Text(
                        "Restart",
                        style: kButtonTextStyle,
                      ),
                      textColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30)
                      ),
                      color: Colors.orange,
                    ),
                    FlatButton.icon(
                      padding: const EdgeInsets.symmetric(
                        vertical: 20,
                        horizontal: 20
                      ),
                      onPressed: () {},
                      icon: const Icon(
                        Icons.api,
                        color: Colors.white,
                      ),
                      label: const Text(
                        "Stop",
                        style: kButtonTextStyle,
                      ),
                      textColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30)
                      ),
                      color: Colors.red,
                    )
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildApplicationStatus(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Application Status",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w600
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  children: [
                    Image.asset(
                      "assets/images/dummy.png",
                      height: screenHeight * 0.12,
                    ),
                    SizedBox(height: screenHeight * 0.015),
                    const Text(
                      "CPU: 100%",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                )
              ],
            ),
          ],
        ),
      ),
    );
  }

}