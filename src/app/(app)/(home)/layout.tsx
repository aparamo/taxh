import {ReactNode} from 'react';


export default function AppLayout({children}: {children: ReactNode}) {
  return (
    <div className="flex grow flex-col w-full">
      {children}
    </div>
  );
}
