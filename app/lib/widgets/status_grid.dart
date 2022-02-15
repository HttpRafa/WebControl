import 'package:flutter/material.dart';

class StatusGrid extends StatelessWidget {

  const StatusGrid({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.25,
      color: Colors.orange,

    );
  }

}