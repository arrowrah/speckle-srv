import { userEvent, within } from '@storybook/testing-library'
import Button from '~~/components/form/Button.vue'
import { Story, Meta } from '@storybook/vue3'
import { wait } from '@speckle/shared'
import { VuePlayFunction, mergeStories } from '~~/lib/common/helpers/storybook'

export default {
  title: 'Speckle/Form/Button',
  component: Button,
  argTypes: {
    to: {
      type: 'string'
    },
    default: {
      type: 'string',
      description: 'Default slot holds button contents'
    },
    click: {
      action: 'clicked',
      type: 'function'
    },
    size: {
      options: ['big', 'normal', 'small'],
      control: { type: 'select' }
    },
    fullWidth: {
      type: 'boolean'
    },
    type: {
      options: ['primary', 'secondary', 'danger', 'outline', 'success', 'warning'],
      control: { type: 'select' }
    },
    external: {
      type: 'boolean'
    },
    disabled: {
      type: 'boolean'
    },
    submit: {
      type: 'boolean'
    }
  },
  parameters: {
    docs: {
      description: {
        component: 'A standard button to be used anywhere you need any kind of button'
      }
    }
  }
} as Meta

const clickPlayBuilder: (rightClick: boolean) => VuePlayFunction =
  (rightClick) =>
  async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    userEvent.click(button, rightClick ? { button: 2 } : undefined)

    await wait(1000)

    userEvent.tab()
  }
const rightClickPlay = clickPlayBuilder(true)
const leftClickPlay = clickPlayBuilder(false)

export const Default: Story = {
  render: (args) => ({
    components: { FormButton: Button },
    setup() {
      return { args }
    },
    template: `<form-button v-bind="args" @click="args.click">{{ args.default || 'Submit' }}</form-button>`
  }),
  play: rightClickPlay,
  args: {
    target: '_blank',
    to: 'https://google.com',
    default: 'Click me to open Google!',
    size: 'normal',
    type: 'primary'
  },
  parameters: {
    docs: {
      source: {
        code: '<FormButton to="/">Hello World!</FormButton>'
      }
    }
  }
}

export const Disabled: Story = mergeStories(Default, {
  play: leftClickPlay,
  args: {
    disabled: true,
    default: 'Disabled button'
  },
  parameters: {
    docs: {
      description: {
        story: 'Button is disabled and no mouse events fire'
      }
    }
  }
})

export const NoTarget: Story = mergeStories(Default, {
  play: leftClickPlay,
  args: {
    to: null,
    default: 'No URL, only for tracking click events'
  }
})

export const Small: Story = mergeStories(Default, {
  args: {
    size: 'small',
    default: 'Small button'
  }
})

export const Big: Story = mergeStories(Default, {
  args: {
    size: 'big',
    default: 'Big button'
  }
})

export const FullWidth: Story = mergeStories(Default, {
  args: {
    fullWidth: true,
    default: 'Full width button'
  }
})

export const Secondary: Story = mergeStories(Default, {
  args: {
    type: 'secondary',
    default: 'Secondary variant'
  }
})

export const Danger: Story = mergeStories(Default, {
  args: {
    type: 'danger',
    default: 'Danger variant'
  }
})

export const Outline: Story = mergeStories(Default, {
  args: {
    type: 'outline',
    default: 'Outline variant'
  }
})

export const Success: Story = mergeStories(Default, {
  ...Default,
  args: {
    ...Default.args,
    type: 'success',
    default: 'Success variant'
  }
})

export const Warning: Story = mergeStories(Default, {
  args: {
    type: 'warning',
    default: 'Warning variant'
  }
})

export const External: Story = mergeStories(Default, {
  args: {
    external: true,
    to: '/',
    default: 'External link'
  },
  parameters: {
    docs: {
      description: {
        story: 'Forces target to be treated as an external link'
      }
    }
  }
})

export const Submit: Story = mergeStories(Default, {
  play: leftClickPlay,
  args: {
    to: null,
    submit: true,
    default: 'Submit button'
  },
  parameters: {
    docs: {
      description: {
        story: 'Rendered as button w/ type=submit, which will submit any parent forms'
      }
    }
  }
})
