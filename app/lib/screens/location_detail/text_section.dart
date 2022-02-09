import 'package:flutter/material.dart';

class TextSection extends StatelessWidget {

  static const double _hPad = 12.0;

  final String _title;
  final String _body;

  const TextSection(this._title, this._body, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          padding: const EdgeInsets.fromLTRB(_hPad, 23, _hPad, 4),
          child: Text(_title, style: Theme.of(context).textTheme.bodyText1),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(_hPad, 10, _hPad, _hPad),
          child: Text(_body, style: Theme.of(context).textTheme.bodyText2),
        )
      ],
    );
  }

}