class ClientSurveysController < ApplicationController
  before_action :set_client_survey, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @client_surveys = ClientSurvey.all
    respond_with(@client_surveys)
  end

  def show
    respond_with(@client_survey)
  end

  def new
    
    @survey = Admin::Survey.find_by url_token: params[:survey_url]
    # byebug
    @client_survey = ClientSurvey.new
    respond_with(@client_survey)
  end

  def edit
  end

  def create
    byebug
    @client_survey = ClientSurvey.new(client_survey_params)
    @client_survey.save
    respond_with(@client_survey)
  end

  def update
    @client_survey.update(client_survey_params)
    respond_with(@client_survey)
  end

  def destroy
    @client_survey.destroy
    respond_with(@client_survey)
  end

  private
    def set_client_survey
      @client_survey = ClientSurvey.find(params[:id])
    end

    def client_survey_params
      params.require(:client_survey).permit(:text, :name, :email, :survey_id)
    end
end
