"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mason = require("mason.cli");

var _knexUtil = require("../knex-util");

var _knexUtil2 = _interopRequireDefault(_knexUtil);

var _knex = require("knex");

var _knex2 = _interopRequireDefault(_knex);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MigrateResetCommand = function (_Command) {
    _inherits(MigrateResetCommand, _Command);

    function MigrateResetCommand() {
        _classCallCheck(this, MigrateResetCommand);

        return _possibleConstructorReturn(this, (MigrateResetCommand.__proto__ || Object.getPrototypeOf(MigrateResetCommand)).apply(this, arguments));
    }

    _createClass(MigrateResetCommand, [{
        key: "run",
        value: async function run(input, conf) {
            var config = void 0;
            if (input.options["knex-path"]) {
                config = require(_path2.default.resolve(input.options["knex-path"]));
            } else {
                config = require(_path2.default.resolve(process.cwd() + "/knexfile.js"));
            }

            if (!config) {
                throw new Error("Unable to locate knexfile!");
            }

            var NODE_ENV = process.env.NODE_ENV || "development";
            var knex = (0, _knex2.default)(config[NODE_ENV] || config);
            var util = new _knexUtil2.default(knex);

            var exclude = void 0;
            if (input.options.exclude) {
                exclude = input.options.excludedTables.split(",");
            } else {
                exclude = [];
            }

            var tables = await util.allTableNames(exclude);
            var action = input.flags.includes("drop") ? "drop" : input.flags.includes("delete") ? "delete" : "truncate";

            console.log("Preparing to " + action + " tables...");

            if (action === "drop") {
                await util.dropTables(tables);
            } else if (action === "delete") {
                await util.deleteFromTables(tables);
            } else {
                await util.truncateTables(tables);
            }

            console.log("Tables cleaned");
            return;
        }
    }], [{
        key: "help",
        value: function help() {
            console.log("\n            Reset your knex database.\n\n            Options:\n                --exclude           Exclude one or more tables from the reset\n                --drop              Drop all tables not listed in --exclude\n                --delete            Delete contents of all tables not listed in --exclude\n                --knexPath=[path]   Supply the path of your knexfile (./knexfile by default)\n        ");
        }
    }]);

    return MigrateResetCommand;
}(_mason.Command);

exports.default = MigrateResetCommand;