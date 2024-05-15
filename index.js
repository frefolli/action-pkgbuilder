const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const process = require('process');

try {
  let cache_path = core.getInput('cache-path');
  let output_path = core.getInput('output-path');

  const pkgbuilder_install_dir = `${cache_path}/python-pkgbuilder`;
  if (fs.existsSync(pkgbuilder_install_dir)) {
    const prevdir = process.cwd();
    exec.exec(`cd ${pkgbuilder_install_dir}`);
    exec.exec('git pull');
    exec.exec(`cd ${prevdir}`);
  } else {
    exec.exec(`git clone https://github.com/frefolli/python-pkgbuilder/ ${pkgbuilder_install_dir}`);
  }

  exec.exec(`ln -sf ${pkgbuilder_install_dir}/pkgbuilder pkgbuilder`);
  exec.exec(`python -m pkgbuilder -o ${output_path}`);
} catch (error) {
  core.setFailed(error.message);
}
