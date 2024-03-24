#' pickerCascade
#'
#'
#'
#' @param inputId Id of input.
#' @param ... UI functions to be wrapped (must contain pickerInputs)
#' @param dynhide boolean to indicate whether to hide cleared pickerInputs. default = FALSE.
#'
#' @examples
#'
#' library(shiny)
#'
#' ui <- function() {
#'   fluidPage(
#'     pickerCascade(
#'       "theId",
#'       shiny::fluidRow(
#'         shiny::column(width = 4, shinyWidgets::pickerInput("one", "one", 1:10)),
#'         shiny::column(width = 4, shinyWidgets::pickerInput("two", "Two", 2:10)),
#'         shiny::column(width = 4, shinyWidgets::pickerInput("tre", "Tre", 3:10))
#'       ),
#'       dynhide = TRUE
#'     ),
#'     shiny::textOutput("text")
#'   )
#' }
#'
#' server <- function(input, output){
#'
#'   observeEvent(input$theId, {
#'     print(input$theId)
#'     print(typeof(input$theId))
#'     print(class(input$theId))
#'   })
#'   output$text <- shiny::renderText({input$theId[[2]]})
#'
#' }
#'
#' if(interactive()) {
#'  shinyApp(ui, server)
#' }
#'
#' @importFrom shiny tags tagList
#' @importFrom htmltools htmlDependency
#' @importFrom shinyWidgets actionBttn
#'
#' @export
pickerCascade <- function(inputId, ..., dynhide = FALSE){

  stopifnot(!missing(inputId))
  dep <- htmltools::htmlDependency(
    name = "cascadeInputBinding",
    version = "1.0.0",
    src = c(file = system.file("assets", package = "pickercascade")),
    script = "cascadeInput.js"
  )
  btn <- shinyWidgets::actionBttn(paste0(inputId, "-btn"), "send", class = "sndbtn")

  tagList(
    dep,
    shiny::div(
      class = "cascadeInputBinding",
      class = if(dynhide) "dynhide",
      id = inputId,
      shiny::div(
        ...
        ),
      btn
    )
  )
}
