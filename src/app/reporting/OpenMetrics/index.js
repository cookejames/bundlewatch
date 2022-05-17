import { createWriteStream } from 'fs'
import { STATUSES } from '../../'

export const createOpenMetrics = (fullResults, outputPath) => {
    return new Promise((resolve, reject) => {
        const stream = createWriteStream(outputPath)
        stream.on('error', reject)
        stream.on('close', resolve)

        const writeLn = (msg) => stream.write(msg + '\n')
        writeLn(`# TYPE bundlewatch_file_size_bytes gauge`)
        writeLn(`# UNIT bundlewatch_file_size_bytes bytes`)
        writeLn(`# HELP bundlewatch_file_size_bytes The file size`)
        writeLn(`# TYPE bundlewatch_file_pass_boolean gauge`)
        writeLn(`# UNIT bundlewatch_file_pass_boolean boolean`)
        writeLn(
            `# HELP bundlewatch_file_pass_boolean Whether the file is smaller than its limit`,
        )
        fullResults.forEach(({ filePath, size, maxSize, status }) => {
            writeLn(
                `bundlewatch_file_size_bytes{path="${filePath}",maxSize="${maxSize}"} ${size}`,
            )
            writeLn(
                `bundlewatch_file_pass_boolean{path="${filePath}"} ${
                    status === STATUSES.PASS ? 1 : 0
                }`,
            )
        })
        writeLn('# EOF')
        stream.end()
    })
}
