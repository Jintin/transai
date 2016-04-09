# transai
[![npm version](https://badge.fury.io/js/transai.svg)](http://badge.fury.io/js/transai)
[![Build Status](https://travis-ci.org/Jintin/transai.svg?branch=master)](https://travis-ci.org/Jintin/transai)
[![Code Climate](https://codeclimate.com/github/Jintin/transai/badges/gpa.svg)](https://codeclimate.com/github/Jintin/transai)
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/JStumpp/awesome-android)
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/vsouza/awesome-ios)

transai is a command line tool to help you do Android and iOS translation management. You can extract string files to csv format, or generate string files from csv file for both Android, iOS and Mac.

## Installation
Just install it by npm:

```bash
$ sudo npm install transai -g
```

## Usage

```bash
Usage:
  transai load [COMMAND]    # load string files
  transai save [COMMAND]    # save string files
  transai -h | --help       # help
  transai -v | --version    # version info

Options:
  -i, --ios                 # ios file path
  -a, --android             # android file path
  -f, --from                # from which lang (both ios & android)
  --from_ios                # from which ios lang
  --from_android            # from which android lang
  -t, --to                  # to which lang (both ios & android)
  --to_ios                  # to which ios lang
  --to_android              # to which android lang
  -c, --csv                 # csv file
```

### Example:
`$ transai load -a ~/android -i ~/ios --from en --to de -c ~/strings.csv`

extract strings to strings.csv under ~/android and ~/ios folder

`$ transai load -a ~/android -i ~/ios --from_android default --from_ios en --to_android zh_tw --to_ios zh-Hant -c ~/strings.csv`

extract strings base on android default lang and ios en lang to android zh_tw lang and ios zh-Hant lang

`$ transai save -a ~/android -i ~/ios --from en --to de -c ~/strings.csv`

generate string files from strings.csv under ~/android and ~/ios folder

`$ transai save -a ~/android -i ~/ios --from_android default --from_ios en --to_android zh_tw --to_ios zh-Hant -c ~/strings.csv`

generate string files base on android default lang and ios en lang to android zh_tw lang and ios zh-Hant lang

See `transai --help` or `transai <command> --help` for more information.

## Contributing
Bug reports and pull requests are welcome on GitHub at [https://github.com/Jintin/transai](https://github.com/Jintin/transai).

## License
The module is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
