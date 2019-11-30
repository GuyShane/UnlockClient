# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2019-11-29
### Changed
- Some reset and z-index styling rules
- Spacing in README

## [3.0.0] - 2019-11-27
### Added
- Ability for users to sign up directly from client sites

### Changed
- Module exports an object instead of a class
  - Use `Unlock.init({...})` instead of `new Unlock({...})`
- Using the provided UI is no longer optional
- Build process uses parcel instead of gulp

### Removed
- Options `button`, `buttonId`, `onSend`, `onOpen`, `onClose`
- Methods `unlock()`, `isOpen()`, `enableButton()`, `disableButton()`

## [1.0.0 - 2.0.0]
- Initial release and upgrades
