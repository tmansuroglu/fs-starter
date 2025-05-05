import { Prisma } from "@generated-prisma"

export enum PrismaErrorCode {
  // ── Initialization & Connection ───────────────────────────────────────────
  AuthenticationFailed = "P1000",
  CannotReachDb = "P1001",
  ConnectionTimedOut = "P1002",
  DatabaseDoesNotExist = "P1003",
  OperationsTimedOut = "P1008",
  DatabaseAlreadyExists = "P1009",
  AccessDenied = "P1010",
  TlsConnectionError = "P1011",
  SchemaValidationError = "P1012",
  InvalidConnectionString = "P1013",
  UnderlyingKindDoesNotExist = "P1014",
  UnsupportedFeatureUsed = "P1015",
  RawQueryParamsMismatch = "P1016",
  ConnectionClosedUnexpectedly = "P1017",

  // ── Query Engine ────────────────────────────────────────────────────────────
  ValueTooLong = "P2000",
  RecordNotFound = "P2001",
  UniqueConstraintViolation = "P2002",
  ForeignKeyConstraintViolation = "P2003",
  DatabaseConstraintFailed = "P2004",
  StoredValueInvalid = "P2005",
  ProvidedValueInvalid = "P2006",
  DataValidationError = "P2007",
  QueryParsingError = "P2008",
  QueryValidationError = "P2009",
  RawQueryFailed = "P2010",
  NullConstraintViolation = "P2011",
  MissingRequiredValue = "P2012",
  MissingRequiredArgument = "P2013",
  RelationViolation = "P2014",
  RelatedRecordNotFound = "P2015",
  QueryInterpretationError = "P2016",
  RecordsNotConnected = "P2017",
  RequiredConnectedRecordsMissing = "P2018",
  InputError = "P2019",
  ValueOutOfRange = "P2020",
  TableDoesNotExist = "P2021",
  ColumnDoesNotExist = "P2022",
  InconsistentColumnData = "P2023",
  ConnectionPoolTimeout = "P2024",
  DependentRecordNotFound = "P2025",
  FeatureNotSupportedByProvider = "P2026",
  MultipleDatabaseErrors = "P2027",
  TransactionApiError = "P2028",
  QueryParameterLimitExceeded = "P2029",
  FulltextIndexNotFound = "P2030",
  ReplicaSetRequired = "P2031",
  NumberExceeds64Bit = "P2033",
  TransactionDeadlock = "P2034",
  AssertionViolation = "P2035",
  ExternalConnectorError = "P2036",
  TooManyDatabaseConnections = "P2037",

  // ── Migration Engine ────────────────────────────────────────────────────────
  DatabaseCreationFailed = "P3000",
  DestructiveChangesPossible = "P3001",
  MigrationRolledBack = "P3002",
  InvalidMigrationsFormat = "P3003",
  SystemDbAlterationForbidden = "P3004",
  NonEmptySchemaOnBaseline = "P3005",
  ShadowDbCreationFailed = "P3006",
  PreviewFeatureNotAllowed = "P3007",
  MigrationAlreadyApplied = "P3008",
  FailedMigrationsDetected = "P3009",
  MigrationNameTooLong = "P3010",
  CannotRollbackNotApplied = "P3011",
  CannotRollbackNotInFailedState = "P3012",
  ProviderArraysNotSupported = "P3013",
  ShadowDbCreationFailedAlt = "P3014",
  MigrationFileNotFound = "P3015",
  ResetFallbackFailed = "P3016",
  MigrationNotFound = "P3017",
}

type ErrorMessageFn = (err: Prisma.PrismaClientKnownRequestError) => string

/** “Not found” message for models, tables, or dependent records */
const recordNotFoundHandler: ErrorMessageFn = (err) => {
  const model = err.meta?.modelName ?? "resource"
  return `${model} not found.`
}

/** Generic foreign-key violation handler */
const foreignKeyViolationHandler: ErrorMessageFn = (err) => {
  const field = err.meta?.field_name ?? "related field"
  return `Foreign key constraint violation on ${field}.`
}

/**
 * Partial map of PrismaErrorCode → message function.
 * Unhandled codes will fall back to a generic message.
 */
const errorMessageHandlers: Partial<Record<PrismaErrorCode, ErrorMessageFn>> = {
  [PrismaErrorCode.RecordNotFound]: recordNotFoundHandler,
  [PrismaErrorCode.RelatedRecordNotFound]: recordNotFoundHandler,
  [PrismaErrorCode.DependentRecordNotFound]: recordNotFoundHandler,

  [PrismaErrorCode.UniqueConstraintViolation]: (err) => {
    const fields = Array.isArray(err.meta?.target)
      ? err.meta.target.join(", ")
      : "field"
    return `Duplicate value for: ${fields}.`
  },

  [PrismaErrorCode.ForeignKeyConstraintViolation]: foreignKeyViolationHandler,

  [PrismaErrorCode.TableDoesNotExist]: () => "Requested table does not exist.",
  [PrismaErrorCode.ColumnDoesNotExist]: () =>
    "Requested column does not exist.",
}

/**
 * Format a PrismaClientKnownRequestError into a clean, user-friendly message.
 */
export function formatPrismaError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const code = error.code as PrismaErrorCode
    const handler = errorMessageHandlers[code]
    return handler ? handler(error) : `Database error (${code}).`
  }
  return "An unexpected error occurred."
}

const SERVICE_UNAVAILABLE = new Set<PrismaErrorCode>([
  PrismaErrorCode.CannotReachDb,
  PrismaErrorCode.ConnectionTimedOut,
  PrismaErrorCode.ConnectionPoolTimeout,
  PrismaErrorCode.TransactionDeadlock,
  PrismaErrorCode.ExternalConnectorError,
  PrismaErrorCode.TooManyDatabaseConnections,
])

const NOT_FOUND = new Set<PrismaErrorCode>([
  PrismaErrorCode.RecordNotFound,
  PrismaErrorCode.RelatedRecordNotFound,
  PrismaErrorCode.DependentRecordNotFound,
  PrismaErrorCode.TableDoesNotExist,
  PrismaErrorCode.ColumnDoesNotExist,
])

const CONFLICT = new Set<PrismaErrorCode>([
  PrismaErrorCode.UniqueConstraintViolation,
  PrismaErrorCode.ForeignKeyConstraintViolation,
  PrismaErrorCode.RelationViolation,
])

const BAD_REQUEST = new Set<PrismaErrorCode>([
  PrismaErrorCode.ValueTooLong,
  PrismaErrorCode.MissingRequiredValue,
  PrismaErrorCode.MissingRequiredArgument,
  PrismaErrorCode.DataValidationError,
  PrismaErrorCode.QueryParsingError,
  PrismaErrorCode.QueryValidationError,
  PrismaErrorCode.InputError,
  PrismaErrorCode.ValueOutOfRange,
  PrismaErrorCode.FeatureNotSupportedByProvider,
])

export function getPrismaErrorStatus(code: PrismaErrorCode | string): number {
  const ec = code as PrismaErrorCode
  if (SERVICE_UNAVAILABLE.has(ec)) return 503
  if (NOT_FOUND.has(ec)) return 404
  if (CONFLICT.has(ec)) return 409
  if (BAD_REQUEST.has(ec)) return 400
  return 500
}
