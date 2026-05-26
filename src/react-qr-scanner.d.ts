declare module 'react-qr-scanner' {
  import * as React from 'react';

  export interface QrScannerProps {
    delay?: number;
    style?: React.CSSProperties;
    onScan?: (data: string | null) => void;
    onError?: (error: unknown) => void;
  }

  export default class QrReader extends React.Component<QrScannerProps> {}
}
