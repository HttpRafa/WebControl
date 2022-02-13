import 'package:flutter/material.dart';
import 'package:webcontrol/Screens/Dashboard/home_screen.dart';

class BottomNavScreen extends StatefulWidget {

  const BottomNavScreen({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _BottomNavScreenState();
  }

}

class _BottomNavScreenState extends State<BottomNavScreen> {

  final List _screens = [
    HomeScreen(),
    HomeScreen(),
    HomeScreen(),
    HomeScreen(),
    HomeScreen(),
  ];

  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() {
          _currentIndex = index;
        }),
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        showSelectedLabels: false,
        showUnselectedLabels: false,
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.grey,
        elevation: 0,
        items: [Icons.home, Icons.account_box, Icons.event_note, Icons.info].asMap().map((key, value) => MapEntry(key, BottomNavigationBarItem(
          label: "Test",
          icon: Container(
            padding: const EdgeInsets.symmetric(
              vertical: 6,
              horizontal: 16
            ),
            decoration: BoxDecoration(
              color: _currentIndex == key ? Colors.blue[600] : Colors.transparent,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(value),
          ),
        ),)).values.toList(),
      ),
    );
  }

}