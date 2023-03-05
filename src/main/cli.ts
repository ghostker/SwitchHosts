import { createCommand } from 'commander'
import chalk from 'chalk'
import { configGet, configSet, updateTrayTitle } from '@main/actions'
import * as cron from '@main/libs/cron'
import * as http_api from '@main/http'
import { I18N } from '@root/common/i18n'
import version from '@root/version.json'

const cst = {
  SUCCESS_EXIT: 0,
  ERROR_EXIT: 1,
  CODE_UNCAUGHTEXCEPTION: 1,
}

const program = createCommand();
const appName = 'switchhosts'

program
  .name(appName)
  .alias('swh')
  .description('Switch hosts quickly!')
  .version(version.join('.'), '-v, --version', `print ${appName} version`)

program.command('*', { hidden: true })
  .action(function () {
    console.log(program.helpInformation() + '\n' + chalk.red('Command not found\n'))
    process.exit(cst.ERROR_EXIT);
  });

program
  .showHelpAfterError(false)
  .showSuggestionAfterError(true)
  .combineFlagAndOptionalValue(true)
  .configureHelp({
    sortSubcommands: true
  })
  .configureOutput({
    writeOut: (str) => process.stdout.write(`${str}`),
    writeErr: (str) => process.stdout.write(`${str}`),
    outputError: (str, write) => {
      write(program.helpInformation() + '\n' + chalk.red(str))
    }
  })

program.parse()

// 无参数时输出help信息
if (process.argv.length == 2) {
  console.log(process.argv)
  program.parse(process.argv)
  program.help()
  process.exit(cst.ERROR_EXIT)
}