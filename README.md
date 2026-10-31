# Shehnaiyan — Donation App (React Native)

A cross-platform mobile app that connects people who need financial help with donors. **Acceptors** submit a verified help request (applicant and guardian details, CNIC, income, required amount and date, supporting documents). **Donors** browse live requests, see how much has been raised against the target, and donate by uploading proof of payment. Acceptors can track the status of their requests in real time.

![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-6B52AE?logo=react&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?logo=apple&logoColor=white)

## Features

- **Two user roles** – Donor and Acceptor, each with its own navigation stack
- **Auth** – sign up / login against a REST API, token persisted with AsyncStorage
- **Help requests** – detailed multi-section form with validation (React Hook Form), date picker and document/image upload
- **Live feed** for donors showing amount raised vs. target and delivery date
- **Donate flow** – choose payment method and attach payment screenshot
- **Request status** screen for acceptors
- Global state with Redux, toast notifications, reusable Button / Input / Loader components and responsive sizing helpers

## Tech stack

| Area        | Tools                                                     |
| ----------- | --------------------------------------------------------- |
| Mobile      | React Native 0.67, React 17                               |
| Navigation  | React Navigation (stack)                                  |
| State       | Redux, React Redux                                        |
| Forms       | React Hook Form                                           |
| Networking  | Axios                                                     |
| Device APIs | Image Picker, Date/Time Picker, AsyncStorage              |

## Project structure

```
src/
├── screens/       # login, signup, Donor, acceptor, status
├── navigation/    # authStack, donarStack, acceptorStack
├── components/    # Button, Input, Loader, DonorAdd, AddStatus
├── redux/         # actions and reducer
├── theme/         # colours and responsive Metrix helpers
└── global.js      # API base URL, toast + helpers
```

## Getting started

**Requirements:** Node.js 16+, React Native CLI environment ([setup guide](https://reactnative.dev/docs/environment-setup)), Android Studio and/or Xcode

```bash
git clone https://github.com/darshan82/Donation-App-React-Native.git
cd Donation-App-React-Native
yarn install
```

Set the API URL in `src/global.js` (`baseUrl`), then run:

```bash
yarn android
```

```bash
cd ios && pod install && cd .. && yarn ios
```

## Author

**Darshan Lal** — Full-Stack Developer
[Portfolio](https://darshan-portfolio-one.vercel.app/) · [GitHub](https://github.com/darshan82)
