class Admin::SurveysController < AdminController
  before_action :set_admin_survey, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    # @admin_surveys = Admin::Survey.all
    @admin_surveys = current_user.surveys.all
    
    respond_with(@admin_surveys)
  end

  def show
    respond_with(@admin_survey)
  end

  def new
    @admin_survey = current_user.surveys.new
    respond_with(@admin_survey)
  end

  def edit
  end

  def create
    
    @admin_survey = current_user.surveys.new(admin_survey_params)
    @admin_survey.save
    respond_with(@admin_survey)
  end

  def update
    @admin_survey.update(admin_survey_params)
    respond_with(@admin_survey)
  end

  def destroy
    @admin_survey.destroy
    respond_with(@admin_survey)
  end

  private
    def set_admin_survey
      @admin_survey = current_user.surveys.find(params[:id])
    end
    # def set_survey
    #   @admin_survey = Admin::Survey.find(params[:id])
    # end

    def admin_survey_params
      params.require(:admin_survey).permit(:name, :url_token, :question)
    end
end
