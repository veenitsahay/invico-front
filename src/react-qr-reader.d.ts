declare module 'react-qr-reader' {
  import * as React from 'react';

  export interface QrReaderProps {
    onResult?: (result: any, error: any) => void;
    onScan?: (data: string | null) => void;
    onError?: (error: any) => void;
    delay?: number;
    style?: React.CSSProperties;
    constraints?: MediaTrackConstraints;
    facingMode?: "user" | "environment";
  }

  export default class QrReader extends React.Component<QrReaderProps> {}
}
