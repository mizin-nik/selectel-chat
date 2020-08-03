import {
  trigger,
  animate,
  transition,
  style,
  query,
  animateChild,
  group
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [style({ opacity: 0 })],
      { optional: true }
    ),
    query(
      ':leave',
      [style({ opacity: 1 }), animate('0.25s', style({ opacity: 0 }))],
      { optional: true }
    ),
    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.25s', style({ opacity: 1 }))],
      { optional: true }
    )
  ])
]);

export const routerTransition = trigger('routerTransition', [
  transition('* => _settings, _signIn => _root', [
    query(':enter, :leave',
      style({
          position: 'absolute', width: '100%', height: '100%'
        }
      ), { optional: true }
    ),
    group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.25s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.25s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(-100%)' }))
      ], { optional: true }),
    ])
  ]),

  transition('_settings => _rooms', [
    query(':enter, :leave',
      style({
          position: 'absolute', width: '100%', height: '100%'
        }
      ), { optional: true }),
    group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.25s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.25s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(100%)' }))
      ], { optional: true }),
    ])
  ]),

  transition('_rooms => _settings', [
    query(':enter, :leave',
      style({
          position: 'absolute', width: '100%', height: '100%'
        }
      ), { optional: true }),
    group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.25s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.25s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(-100%)' }))
      ], { optional: true }),
    ])
  ]),
]);
