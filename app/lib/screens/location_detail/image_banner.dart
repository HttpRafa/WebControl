import 'package:flutter/material.dart';

class ImageBanner extends StatelessWidget {

  final String _path;

  const ImageBanner(this._path, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints.expand(
        height: 200,
      ),
      decoration: const BoxDecoration(color: Colors.grey),
      child: Image.asset(
        _path,
        fit: BoxFit.cover
      ),
    );
  }

}