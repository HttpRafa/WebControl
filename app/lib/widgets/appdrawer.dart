import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
        child: ListView(
      children: const [
        DrawerHeader(
          decoration: BoxDecoration(
            color: Colors.blue,
          ),
          child: Text(
            "WebControl",
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
            ),
          ),
        ),
        ListTile(
          leading: Icon(Icons.home),
          title: Text("Home"),
        ),
        ListTile(
          leading: Icon(Icons.android),
          title: Text("Application"),
        ),
        ListTile(
          leading: Icon(Icons.build_sharp),
          title: Text("Options"),
        ),
        ListTile(
          leading: Icon(Icons.article_outlined),
          title: Text("Console"),
        ),
        ListTile(
          leading: Icon(Icons.folder),
          title: Text("Files"),
        ),
        ListTile(
          leading: Icon(Icons.supervised_user_circle),
          title: Text("Access"),
        ),
        ListTile(
          leading: Icon(Icons.build_sharp),
          title: Text("Settings"),
        ),
      ],
    ));
  }
}
